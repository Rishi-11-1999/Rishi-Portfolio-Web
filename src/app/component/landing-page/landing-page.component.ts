import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';

interface ProjectDetail {
  tag: string;
  title: string;
  contributions: string[];
  features: string[];
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  // ---- Typewriter tagline ----------------------------------------------
  typewriterText = '';
  private phrases = [
    'Angular & Node.js',
    'Full Stack Development',
    'AI-Powered Features',
    'WordPress & Hosting',
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private typewriterTimer: ReturnType<typeof setTimeout> | null = null;

  // ---- Project "System Details" modal -----------------------------------
  activeProject: ProjectDetail | null = null;

  projectData: Record<string, ProjectDetail> = {
    travel: {
      tag: 'Full-Stack / Production',
      title: 'Travel Booking Platform',
      contributions: [
        'Extended and maintained a 10+ year live production booking system without disrupting real bookings or users.',
        'Shipped end-to-end features across Angular (frontend) and Node.js (backend), from UI to API to schema change.',
        'Diagnosed and resolved production bugs directly on Linux servers via PuTTY and WinSCP deploys.',
      ],
      features: [
        'Live search and booking flow across an established MSSQL schema.',
        'Zero-downtime deploys pushed straight to the production server.',
        'Bug fixes shipped against real user traffic on a decade-old codebase.',
        'Feature work coordinated across frontend and backend in the same release.',
      ],
    },
    lms: {
      tag: 'Full-Stack / Greenfield',
      title: 'Learning Management System',
      contributions: [
        'Built core LMS modules from the ground up using Angular and Node.js on a greenfield codebase.',
        'Implemented course management, user roles, and content delivery across the stack.',
        "Owned a specific module end to end — swap in the one you're proudest of.",
      ],
      features: [
        'Role-based access for students, instructors, and admins.',
        'Course and content management built on Express + MSSQL.',
        'Structured for future modules to plug in cleanly.',
      ],
    },
    ai: {
      tag: 'Personal / AI',
      title: 'AI-Assisted Feature — OpenAI API',
      contributions: [
        'Wired a Node.js backend to the OpenAI API to add an AI-driven feature — describe exactly what it does.',
        'Handled prompt construction, response parsing, and error handling around the API calls.',
        'Exposed the feature through a clean REST endpoint for the frontend to consume.',
      ],
      features: [
        'REST endpoint wrapping OpenAI API calls.',
        'Structured prompt handling with error and rate-limit handling.',
        'Response parsing tuned for the specific use case.',
      ],
    },
    wp: {
      tag: 'Personal / WordPress',
      title: 'Pinterest Business Site',
      contributions: [
        'Set up hosting, domain, and WordPress from scratch on Hostinger.',
        'Configured theme, pages, and plugins to run a Pinterest-driven personal business — add specifics.',
        'Applied basic on-page SEO so the site surfaces correctly for its target audience.',
      ],
      features: [
        'WordPress site fully configured on Hostinger hosting.',
        'Theme and plugin setup tailored to the business.',
        'Basic SEO — titles, meta descriptions, sitemap.',
      ],
    },
  };

  // ---- Scroll reveal ------------------------------------------------------
  private observer: IntersectionObserver | null = null;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.startTypewriter();
  }

  ngAfterViewInit(): void {
    this.setupScrollReveal();
  }

  ngOnDestroy(): void {
    if (this.typewriterTimer) clearTimeout(this.typewriterTimer);
    if (this.observer) this.observer.disconnect();
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private startTypewriter(): void {
    if (this.prefersReducedMotion()) {
      this.typewriterText = this.phrases[0];
      return;
    }
    const tick = () => {
      const word = this.phrases[this.phraseIndex];
      this.typewriterText = this.deleting
        ? word.slice(0, this.charIndex--)
        : word.slice(0, this.charIndex++);

      let delay = this.deleting ? 35 : 65;
      if (!this.deleting && this.charIndex === word.length + 1) {
        delay = 1400;
        this.deleting = true;
      } else if (this.deleting && this.charIndex < 0) {
        this.deleting = false;
        this.charIndex = 0;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        delay = 300;
      }
      this.typewriterTimer = setTimeout(tick, delay);
    };
    tick();
  }

  private setupScrollReveal(): void {
    const items = this.host.nativeElement.querySelectorAll('.reveal');
    if (this.prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    items.forEach((el) => this.observer!.observe(el));
  }

  // ---- Modal controls -----------------------------------------------------
  openModal(key: string): void {
    const detail = this.projectData[key];
    if (!detail) return;
    this.activeProject = detail;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeProject = null;
    document.body.style.overflow = '';
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeModal();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeProject) this.closeModal();
  }
}