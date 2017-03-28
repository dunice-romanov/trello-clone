import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PostService } from '../services/post.service';
import { LoginService } from '../services/login.service';
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
  readonly TEXT_PLACEHOLDER_COMMENTARY = 'Post a comment';
  readonly TEXT_ERROR_BLACK_FIELD = 'This field can not be blank'
  readonly TEXT_ERROR_SERVER_PROBLEM = 'Server is anavailable';
  readonly TEXT_ERROR_PERMISSION = 'You dont have a permission';
  readonly TEXT_BUTTON_POST_COMMENT = "Send";
  readonly TEXT_BLANK_DESCRIPTION = "Edit the descriprion";
  readonly TEXT_BUTTON_POST_DESCRIPTION = "Save";
  readonly TEXT_BUTTON_CLOSE = "X";
  readonly TEXT_DESCRIPTION_TITLE = "Description";
  readonly TEXT_COMMENTARY_TITLE = "Add Comment";

  postId: number;

  private isTitleCollapsed: boolean;
  private isTextCollapsed: boolean;
  private isDescriptionCollapsed: boolean;
  private commentary: string;
  private post: FullPost;
  private title: string;
  private description: string;

  constructor(public activeModal: NgbActiveModal,
              private postSevice: PostService,
              private loginService: LoginService) {
    this.description = '';
    this.title = '';
    this.isTextCollapsed = false;
    this.isTitleCollapsed = false;
    this.isDescriptionCollapsed = false;
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
      this.commentary = '';
  }

  onClickUpdateText(text: string) {
    this.onBlurUpdateText(text);
    this.isDescriptionCollapsed = false;
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
      (error) => { debugger; this.errorHandler(error); }
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


  onEnterPostComment() {
    let text = this.commentary.trim();
    if (text == '') { return; };

    this.postSevice.postCommentary(this.postId, text)
                  .subscribe( (data) => {
                      this.postSevice.getFullPost(this.postId)
                          .subscribe((data) => { 
                              this.commentary = ''; 
                              this.post = data }, 
                            (error)=>{ this.errorHandler(error) })}, 
                    (error)=>{this.errorHandler(error)});
    
  }

  isDescriptionBlank(){
    let description = this.description.trim();
    if (description == '') { return true; }
    return false;
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
        debugger;
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
