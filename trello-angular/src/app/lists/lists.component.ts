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

	readonly TEXT_ADD_NEW_POST = "Add new post, honey";
	readonly TEXT_ADD_NEW_LIST = 'Add new list!';
	private boardId: Number;
	private sub: any;
	private inputListTitle;
	private isCollapsedArray: Boolean[];

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
							(data) => {this.updateLists(this.boardId)},
							(error) => {debugger;} 
						);
	}

	/*
		Gets post title from listInput[id], 
		requests server to create post
		If error occured - handles
	*/
	onClickAddPost(inputId: number, listId: number) {
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

}
