import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListsService } from '../services/lists.service';
import { List } from '../classes/list';

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
	private lists: List[];
	private inputListTitle;

	constructor(private route: ActivatedRoute, 
				private listService: ListsService) {
		this.boardId = 0;
		this.lists = [];
		this.inputListTitle = '';
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe((params) => {
	       this.boardId = +params['id'];
	       this.updateLists(this.boardId);
		});
	}

	onClickAddList() {
		let title = this.inputListTitle.trim();
		if (title == '') {return;}
		this.listService.createList(this.boardId, title)
						.subscribe(
							(data) => {this.updateLists(this.boardId)},
							(error) => {debugger;} 
						);
	}

	onClickAddPost(listId: Number) {
		this.listService.createPost(listId, 'Hello world!').subscribe(
				(data) => {this.updateLists(this.boardId)},
				(error) => {debugger;}
			);
	}

	private updateLists(boardId: Number){
        this.listService.getListsList(this.boardId)
	       		.subscribe(
	       			(data) => {this.lists = data;},
	       			(error) => {debugger}
	       		);
	}

}
