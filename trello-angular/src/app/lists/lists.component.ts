import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ListsService } from '../services/lists.service';
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

	private boardId: Number;
	private sub: any;
	private inputListTitle;
	private isCollapsedArray: boolean[];
	private isCreateButtonCollapsed: boolean;

	private lists: List[];
	private listInput: string[];

	constructor(private route: ActivatedRoute, 
				private listService: ListsService,
				private modalService: NgbModal) {
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
			(error)=> {debugger;});
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
							(error) => {debugger;} 
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
				(error) => {debugger;}
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
	       			(error) => {debugger}
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

}
