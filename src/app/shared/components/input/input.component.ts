import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-input',
  imports: [FormsModule , ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() control: any;
  @Input() label!: string;
  @Input() type!: string;
  @Input() idInput!: string;
  eyeFlag:boolean = true;

}
