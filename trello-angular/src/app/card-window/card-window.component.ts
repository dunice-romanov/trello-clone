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
  readonly TEXT_ERROR_BLACK_FIELD = 'This field can not be blank'
  readonly TEXT_ERROR_SERVER_PROBLEM = 'Server is anavailable';
  readonly TEXT_ERROR_PERMISSION = 'You dont have a permission';

  postId: number;

  private isTitleCollapsed: boolean;
  private isTextCollapsed: boolean;

  private post: FullPost;
  private title: string;
  private description: string;

  constructor(public activeModal: NgbActiveModal,
              private postSevice: PostService) {
    this.description = '';
    this.title = '';
    this.isTextCollapsed = false;
    this.isTitleCollapsed = false;
  }

  ngOnInit() {
  	this.postSevice.getFullPost(this.postId).subscribe(
  			(data) => { 
          this.post = data;
          this.description = this.post.text; 
          this.title = this.post.title;
        },
  			(error) => { this.errorHandler(error); }
  		);
  }

  /*
    Updates post text on blur, handles errors
  */
  onBlurUpdateText(text: string) {
    let oldTitle = this.post.text.trim();
    let newTitle = text.trim();
    if (newTitle == oldTitle) { 
      return; 
    }

    this.postSevice.patchText(this.postId, newTitle).subscribe(
      (data) => { this.post = data },
      (error) => { this.errorHandler(error); }
    );
  }


  /*
    Updates post title on blur, handles errors
  */
  onBlurUpdateTitle(title: string) {
    let oldTitle = this.post.title;
    let newTitle = title;

    this.updateTitle(newTitle, oldTitle);
  }

  /*
    Updates title on server, returns FullPost in subscribe
  */
  private updateTitle(newTitle: string, oldTitle: string) {
    if (newTitle === undefined) { return; }

    let oldTitleTrimmed = oldTitle.trim();
    let newTitleTrimmed = newTitle.trim();
    if (oldTitleTrimmed == newTitleTrimmed) { 
      this.isTitleCollapsed = false;
      return; 
    }

    this.postSevice.patchTitle(this.postId, newTitleTrimmed).subscribe(
        (data) => {
            this.post = data;
            this.isTitleCollapsed = false;
          },
        (error) => { this.errorHandler(error); }
      );
  }

  /*
    Opens collapsed title
  */
  onClickOpenCollapse(event) {
    this.isTitleCollapsed = true;
  }

  /*
    Handles postService errors
  */
  private errorHandler(error) {
    switch (error['_body']) {
      case this.postSevice.ERROR_BLANK_TITLE:
        alert(this.TEXT_ERROR_BLACK_FIELD);
        break;
      case this.postSevice.ERROR_DONT_HAVE_PERMISSION:
        alert(this.TEXT_ERROR_PERMISSION);
        this.title = this.post.title;
        this.description = this.post.text;
        break;
      default:
        alert(this.TEXT_ERROR_SERVER_PROBLEM);
        break;
    }
  }

}
