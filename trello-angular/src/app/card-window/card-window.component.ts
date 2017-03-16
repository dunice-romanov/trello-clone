import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PostService } from '../services/post.service';

import { FullPost } from '../classes/list';

@Component({
  selector: 'app-card-window',
  templateUrl: './card-window.component.html',
  styleUrls: ['./card-window.component.css'],
  providers: [PostService]
})
export class CardWindowComponent implements OnInit {

  readonly TEXT_ADD_COMMENT = 'Add a commentary, honey';
  readonly TEXT_UPDATE_DESCRIPTION = 'Update me, honey';
  readonly TEXT_PLACEHOLDER_DESCRIPTION = 'Add description';
  postId: number;
  private post: FullPost;
  private title: string;
  private description: string;

  constructor(public activeModal: NgbActiveModal,
              private postSevice: PostService) {
    this.description = '';
    this.title = '';
  }

  ngOnInit() {
  	this.postSevice.getFullPost(this.postId).subscribe(
  			(data) => { 
          this.post = data;
          this.description = this.post.text; 
          this.title = this.post.title;
        },
  			(error) => { debugger; }
  		);
  }

  onBlurUpdateText(text: string) {
    let oldTitle = this.post.text.trim();
    let newTitle = text.trim();
    if (newTitle == oldTitle) { 
      return; 
    }

    this.postSevice.patchText(this.postId, newTitle).subscribe(
      (data) => {this.post = data},
      (error) => {debugger;}
    );
  }

  onBlurUpdateTitle(title: string) {
    let oldTitle = this.post.title.trim();
    let newTitle = title.trim();
    if (newTitle == oldTitle) { 
      return; 
    }

    this.postSevice.patchTitle(this.postId, newTitle).subscribe(
      (data) => {this.post = data},
      (error) => {debugger;}
    );
  }
}
