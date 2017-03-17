import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ListsService } from '../services/lists.service';
import { LoginService } from '../services/login.service';

import { List } from '../classes/list';
import { CardWindowComponent } from '../card-window/card-window.component'
@Component({
	selector: 'app-lists',
	templateUrl: './lists.component.html',
	styleUrls: ['./lists.component.css'],
	providers: [ListsService]
})
export class ListsComponent implements OnInit {

	readonly TEXT_ADD_NEW_POST = "Add";
	readonly TEXT_ADD_NEW_LIST = 'Save';
	readonly TEXT_ADD_NEW_POST_COLLAPSE = "Create new card";
	readonly TEXT_ADD_CLOSE = 'X';
	readonly TEXT_CREATE_LIST = 'Create new list';
	readonly TEXT_MAX_LENGTH_TITLE = '100 symblos maximum';

	readonly TEXT_ERROR_MAX_LENGTH = "You wrote more symbols than system can get :("
	readonly TEXT_ERROR_SERVER_PROBLEM = "Server is unavailable";
	private boardId: Number;
	private sub: any;
	private inputListTitle;

	private isCreateButtonCollapsed: boolean;

	private isCollapsedArray: boolean[];
	private lists: List[];
	private listInput: string[];

	constructor(private route: ActivatedRoute, 
				private listService: ListsService,
				private modalService: NgbModal,
				private loginService: LoginService) {
		this.boardId = 0;
		this.lists = [];
		this.inputListTitle = '';
		this.listInput = [];
		this.isCollapsedArray = [];
		this.isCreateButtonCollapsed = false;
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe((params) => {
	       this.boardId = +params['id'];
	       this.updateLists(this.boardId);

		},
			(error)=> {this.errorHandler(error);});
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