import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AuthService } from '../../../../core/auth/services/auth.service';


@Component({
  selector: 'outpop.component',
  templateUrl: 'outpop.component.html',
  styleUrl: 'outpop.component.css',
  imports: [CommonModule, MatButtonModule, MatDialogClose, MatDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutpopComponent {
  readonly dialogRef = inject(MatDialogRef<OutpopComponent>);
  private readonly authService = inject(AuthService);

  logOut(): void {
    this.authService.logout();
  }
}
