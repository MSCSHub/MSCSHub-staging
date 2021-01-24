import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClassService } from 'src/app/services/classes/class.service';
import { ClassData } from 'src/app/shared/class/class';

@Component({
  selector: 'dialog-review-sumission-dialog',
  templateUrl: 'dialog-review-submission-dialog.html',
})
export class DialogReviewSubmission {}

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.scss']
})
export class CreateReviewComponent implements OnInit {
  error: any
  loading: boolean = false
  submitted: boolean = false
  pros: string[] = ["test"]
  cons: string[] = []
  semesters: string[] = ["Spring", "Summer", "Fall"]
  currentYear: number = (new Date()).getFullYear()
  years: number[] = [this.currentYear, this.currentYear-1, this.currentYear-2]
  courses: ClassData[] | undefined
  reviewForm: FormGroup = new FormGroup({})

  constructor(
    private courseService: ClassService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public dialog: MatDialog,
    private afs: AngularFirestore,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.courseService.classes.subscribe(data =>
      this.courses = data
    )
    this.reviewForm = this.formBuilder.group({
      title: ['', Validators.required],
      course: ['', Validators.required],
      semester: ['', Validators.required],
      year: ['', Validators.required],
      review: ['', Validators.required],
      rating: ['', Validators.required],
      difficulty: ['', Validators.required],
      workload: ['', Validators.required],
      bookUsefulness: ['', Validators.required],
      lectureQuality: ['', Validators.required],
      professorQuality: ['', Validators.required],
      piazzaCommunity: ['', Validators.required],
      projects: ['', Validators.required],
      homework: ['', Validators.required],
      peerReviewed: ['', Validators.required],
      exams: ['', Validators.required],
      // languages: ['', Validators.required],
      userData: ['', Validators.required],
      timestamp: [new Date(), Validators.required],
    })
    this.reviewForm.controls['timestamp'].setValue(new Date())
    this.auth.userData.subscribe(user => {
      this.reviewForm.controls['userData']
        .setValue(JSON.stringify([user.displayName, user.email]))
    })
  }

  onSubmit() {
    console.log("Submitting", this.reviewForm?.invalid)
    this.submitted = true
    if(this.reviewForm?.invalid){
      console.log(this.reviewForm.errors)
      console.log(this.reviewForm)
      return
    }
    console.log("Hello")
    this.loading = true
    this.afs.collection('Reviews')
      .add(this.reviewForm.value)
      .then(result => {
        console.log("Submission result:", result)
        this.loading = false
        this.openDialog()
      }, error => console.log("Submission failed:", error))
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogReviewSubmission)
    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed!", result)
      this.router.navigate(['courses'])
    })
  }

}