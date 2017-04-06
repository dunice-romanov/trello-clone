import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardWindowComponent } from '../card-window/card-window.component'
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  providers: [PostService]
})
export class CardComponent implements OnInit, AfterContentInit {

  private postId;

  constructor(private modalService: NgbModal,
              private route: ActivatedRoute,
              private router: Router,
              private postService: PostService) {
    this.postId = -1;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.postId = +params['id'];
      this.navigateToBoard();
    });
  }

  ngAfterContentInit() {
    this.openModal();
  }

  private openModal() {
    let modalWindow = this.modalService.open(CardWindowComponent)
    modalWindow.componentInstance.postId = this.postId;
  }

  private navigateToBoard() {
    let postId = this.postId;

    this.postService.getFullPost(postId).subscribe((data) => {this.router.navigate([`/boards/${data.boardId}`])})

  }

}
