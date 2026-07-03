import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { FormSetupService } from '../../services/form-setup.service';
import { FormSetupData } from '../../models/form-setup.model';
import { FormBuilderStateService } from '../../services/form-builder';

@Component({
  selector: 'app-integration',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './integration.html',
  styleUrl: './integration.scss',
})
export class Integration implements OnInit, OnDestroy {
  formUrl: string = 'http://localhost:4200/form-builder/preview'; //here static url provide for the form preview.
  isUrlCopied: boolean = false;                      //here urlcopied inital with false value.
  isCodeCopied: boolean = false;
  isPublishing: boolean = false;
  publishSuccess: boolean = false;
  publishError: string = '';

  formName: string = 'Form Builder';
  private currentFormData: FormSetupData | null = null;
  private sub?: Subscription;

  //here static url provide for the qr code generation using the formurl
  get qrCodeUrl(): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(this.formUrl)}`;
  }

  encodeURIComponent(val: string): string {
    return encodeURIComponent(val);
  }

  constructor(
    private router: Router,
    private formSetupService: FormSetupService,
    private formBuilderState: FormBuilderStateService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.formUrl = `${window.location.origin}/form-builder/preview`;
    }

    this.sub = this.formSetupService.getFormSetupData().subscribe({
      next: (data) => {
        if (data) {
          this.currentFormData = data;
          if (data.formName) {
            this.formName = data.formName;
          }
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  //if user click on the cancel button then directly ri-direct in form-setup.
  onCancel(): void {
    this.router.navigate(['/form-builder/builder']);
  }

  /**
   Publish the form:
   1. Grab current form setup data from the service.
   2. Grab canvas fields from the FormBuilderStateService.
   3. Send a POST/PUT to the Laravel backend with status = 'published'.
   4. Show success/error feedback before navigating away.
   */
  onPublishForm(): void {
    //this conditon check whethe data are exist or not.
    if (!this.currentFormData) {
      this.publishError = 'No form setup data found. Please complete Form Setup first.';
      return;
    }

    //variable value change.
    this.isPublishing = true;
    this.publishSuccess = false;
    this.publishError = '';

    const canvasFields = this.formBuilderState.fields;

    //form service access inside the publishform method
    //.subscribe here used to receive data from the obserble.
    this.formSetupService.publishForm(this.currentFormData, canvasFields).subscribe({
      next: (saved) => {
        this.isPublishing = false;
        this.publishSuccess = true;
        console.log('Form published successfully:', saved);
        // Navigate after a short delay so user sees the success state
        setTimeout(() => {
          this.router.navigate(['/form-builder/setup']);
        }, 1800);
      },
      error: (err) => {
        this.isPublishing = false;
        this.publishError = 'Failed to publish form. Please try again.';
        console.error('Publish error:', err);
      },
    });
  }

  //copyurl method which use for the copy the text from the ui and paste anywhere.
  copyUrl(): void {
    navigator.clipboard.writeText(this.formUrl).then(() => {
      this.isUrlCopied = true;
      setTimeout(() => {
        this.isUrlCopied = false;
      }, 2000);
    });
  }

    //copycode method which use for the copy the text from the ui and paste anywhere.

  copyCode(): void {
    const code = this.buildEmbedCode();
    navigator.clipboard.writeText(code).then(() => {
      this.isCodeCopied = true;
      setTimeout(() => {
        this.isCodeCopied = false;
      }, 2000);
    });
  }

  //downloadqrcode for download in png.
  downloadQRCode(): void {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(this.formUrl)}`;

    fetch(qrUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = `${this.formName.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
      })
      .catch((err) => {
        console.error('Failed to download QR code directly, opening in new tab', err);
        window.open(qrUrl, '_blank');
      });
  }

  private buildEmbedCode(): string {
    return `<div id="inquiry-form-content"> </div>

<script>
(function() {
  var container = document.getElementById("inquiry-form-content");

  if (container) {
    var iframe = document.createElement("iframe");
    iframe.src = "${this.formUrl}";
    iframe.style.cssText = "width:100%; border:none; display:block; overflow:hidden; transition: height 0.2s ease-in-out;";

    container.appendChild(iframe);

    window.addEventListener("message", function(event) {
      if (event.data && event.data.height) {
        iframe.style.height = event.data.height + "px";
      }
    });
  }
})();
</script>`;
  }
}
