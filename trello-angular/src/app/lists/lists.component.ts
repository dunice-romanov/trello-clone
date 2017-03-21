import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ListsService } from '../services/lists.service';
import { LoginService } from '../services/login.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { PostService } from '../services/post.service';
import { BoardsService } from '../services/boards.service';

import { ShareBoard } from '../classes/board';
import { List, Post } from '../classes/list';
import { CardWindowComponent } from '../card-window/card-window.component'
@Component({
	selector: 'app-lists',
	templateUrl: './lists.component.html',
	styleUrls: ['./lists.component.css'],
	providers: [ListsService,
				PostService,
				BoardsService]
})
export class ListsComponent implements OnInit, OnDestroy {

	readonly TEXT_ADD_NEW_POST = "Add";
	readonly TEXT_ADD_NEW_LIST = 'Save';
	readonly TEXT_ADD_NEW_POST_COLLAPSE = "Create new card";
	readonly TEXT_ADD_CLOSE = 'X';
	readonly TEXT_CREATE_LIST = 'Create new list';
	readonly TEXT_MAX_LENGTH_TITLE = '100 symblos maximum';
	readonly TEXT_TITLE_MODAL_HEADER = 'Rename Board';
	readonly TEXT_TITLE_MODAL_NAME = 'Name';
	readonly TEXT_TITLE_MODAL_BUTTON = 'Rename';
	readonly TEXT_ERROR_MAX_LENGTH = "You wrote more symbols than system can get :("
	readonly TEXT_ERROR_SERVER_PROBLEM = "Server is unavailable";
	
	private boardId: number;
	private sub: any;
	private inputListTitle;
	private isCreateButtonCollapsed: boolean;
	private boardTitle: string;
	private newBoardTitle: string;
	private draggingPost: Post;
	private accessLevel: string;
	private isCollapsedArray: boolean[];
	private isCollapsedTitleEdit: boolean;
	private lists: List[];
	private listInput: string[];
	private menuVisibility: boolean;

	constructor(private route: ActivatedRoute, 
				private listService: ListsService,
				private modalService: NgbModal,
				private loginService: LoginService,
				private boardService: BoardsService,
				private dragulaService: DragulaService,
				private postService: PostService) {
		
		dragulaService.setOptions('bag-one', {
      		removeOnSpill: false,
    	});
		this.menuVisibility = false;
		this.boardTitle = '';
		this.accessLevel = '';
		this.boardId = 0;
		this.lists = [];
		this.inputListTitle = '';
		this.listInput = [];
		this.isCollapsedArray = [];
		this.isCreateButtonCollapsed = false;
		this.isCollapsedTitleEdit = false;
		this.draggingPost = null;
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe((params) => {
			this.boardId = +params['id'];
			this.boardService.getShareList(this.boardId).subscribe(
				(data) => { this.accessLevel = this.getAccessLevel(data); this.boardTitle = this.getBoardTitle(data);}
			);
			this.listService.getListsList(this.boardId)
				.subscribe(
					(data) => {
						this.lists = data;
						this.dragulaService.dropModel
							.subscribe((value) => { this.onDropModel(value.slice(1)) });
					
					},

					(error) => {this.errorHandler(error);}
				);
			},
			(error)=> {this.errorHandler(error);});
	}

	ngOnDestroy() {
		this.dragulaService.destroy('bag-one');
	}

	/*
		Creates new list with title from input,
		If error occured - handles
	*/
	onClickAddList() {
		let title = this.inputListTitle.trim();
		if (title == '') {return;}
		this.listService.createList(this.boardId, title)
						.subscribe(
							(data) => {
								this.updateLists(this.boardId);
								this.inputListTitle = '';
								this.isCreateButtonCollapsed = false;
								
							},
							(error) => {
								this.inputListTitle = '';
								this.errorHandler(error);
							} 
						);
	}

	/*
		Gets post title from listInput[id], 
		requests server to create post
		If error occured - handles
	*/
	onClickAddPost(inputId: number, listId: number) {
		if (this.listInput[inputId] === undefined) { return; }
		let text = this.listInput[inputId].trim();

		if (text == '') {
			this.listInput[inputId] = ''; 
			return; 
		}

		this.listService.createPost(listId, text)
			.subscribe(
				(data) => {
					this.updateLists(this.boardId);
					this.listInput[inputId] = '';
					this.isCollapsedArray[inputId] = false;
				},
				(error) => {
					this.errorHandler(error);
					this.listInput[inputId] = '';
				}
			);
	}

	/*
		Closes add post collapse
	*/
	onClickAddPostClose(inputId: number) {
		this.isCollapsedArray[inputId] = false;
		this.listInput[inputId] = '';
	}

	/*
		Opens collapse with add post
	*/
	onClickOpenAddPostCollapse(inputId: number) {
		this.closeEveryCollapse();
		this.isCollapsedArray[inputId] = !this.isCollapsedArray[inputId];
	}

	onClickOpenAddListCollapse() {
		this.closeEveryCollapse();
		this.isCreateButtonCollapsed = true;
	}

	/*
		Handler for 'Close' of AddList button 
	*/
	onClickAddListClose() {
		this.isCreateButtonCollapsed = false;
		this.inputListTitle = '';
	}

	/*
		Opens modal window with CardWindowComponent, 
		after - updates lists
	*/
	onClickOpenPost(postId: number, event) {
	    event.stopPropagation();
	    const modalRef = this.modalService.open(CardWindowComponent);

	    modalRef.componentInstance.postId = postId; 
	    modalRef.result
	    	.then((result) => { this.updateLists(this.boardId); })
	    	.catch((reason)=> { this.updateLists(this.boardId); });
	    return false;
	}

	onClickUpdateTitle() {
		let title = this.newBoardTitle.trim();
		if (title == '') {return;}
		this.boardService.patchTitle(this.boardId, title).subscribe(
			(data) => { this.updateBoardTitle(this.boardId); this.isCollapsedTitleEdit = false; }
		);
	}

	onClickCloseUpdateTitle() {
		this.isCollapsedTitleEdit = false;
	}

	private updateBoardTitle(boardId: number) {
		this.boardService.getBoardTitle(boardId).subscribe((data) => this.boardTitle = data);
	}
	private onDropModel(args) {
		let [el, target, source] = args;
		let listTo = args[1].dataset.idList;
		let postIndex = this.lists[target.dataset.idList]['posts'].findIndex((p) => { return p.id == el.dataset.idPost});
		if (this.lists[target.dataset.idList] == undefined) {return;}
		let postAfterDrag: Post = this.lists[listTo].posts[postIndex];
		if (postAfterDrag === undefined) {return;}
		this.postService.patchPosition(postAfterDrag.id, (postIndex + 1), this.lists[listTo].id)
						.subscribe((data)=> { this.updateLists(this.boardId); },
									(error)=>{ this.updateLists(this.boardId); this.errorHandler(error); }) 

	}

	/*
		Updates all lists from server,
		If error occured - handles
	*/
	private updateLists(boardId: Number){
        this.listService.getListsList(this.boardId)
	       		.subscribe(
	       			(data) => {this.lists = data;},
	       			(error) => {this.errorHandler(error);}
	       		);
	}

	/*
		Sets every boolean isCollapsed... to false
	*/
	private closeEveryCollapse() {
		for (let i = 0; i < this.isCollapsedArray.length; i++) {
			this.isCollapsedArray[i] = false;
		}
		this.isCreateButtonCollapsed = false;
	}

	/*
		Checks is this user owner of list or not
	*/
	private isListOwner(owner: string) {
		if (owner === this.loginService.getUsername())
			return true;
		return false;
	}

	private getAccessLevel(shares: ShareBoard[]) {
		let username: string = this.loginService.getUsername();
		for (let share of shares) {
			if (share.username == username) {
				return share.accessLevel;
			}
		}
	}

	private getBoardTitle(shares: ShareBoard[]) {
		let username: string = this.loginService.getUsername();
		for (let share of shares) {
			if (share.username == username) {
				return share.title;
			}
		}
	}

	/*
		Handles errors from listService
	*/
	private errorHandler(error) {
		switch (error['_body']) {
			case this.listService.ERROR_LIST_TITLE_MAX_LENGHT:
				alert(this.TEXT_ERROR_MAX_LENGTH);
				break;
			default:
				alert(this.TEXT_ERROR_SERVER_PROBLEM);
				break;
   		}
	}

}
