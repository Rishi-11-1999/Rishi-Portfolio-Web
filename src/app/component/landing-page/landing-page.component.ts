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
  'Full Stack Developer',
  'Angular & Node.js',
  'RESTful API Integration',
  'AI-Powered Automation',
  'Payment Gateway Integration',
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
      title: 'StayBazar',
      contributions: [
        'Staybazar is a corporate travel and accommodation platform that helps companies manage their employees business travel requirements.',
        'We provide services like hotel and serviced apartment bookings, along with travel ticketing such as flight and other transportation bookings.',
        'In simple terms, Staybazar acts as a bridge between corporate companies and travel/accommodation partners.',
        'Companies can raise travel or stay requirements, and it would go to the Designated managers of the employees and after their approval we would complete the booking, Staybazar helps manage the booking process from requirement to confirmation.',
        'I was working as a Developer there, mainly handling the website and internal systems. My work included developing new features, fixing bugs, improving existing functionalities, automating manual processes, and building solutions based on business requirements.',
        'Delivered client onboarding sessions, product demonstrations, and staff training programmes achieving high cross-department adoption.',
        'Administered ServiceNow modules — Incident, Problem, Change, IT Asset Management, and Request Fulfillment.',
        'Oversaw frontend development (HTML, CSS, JavaScript) and mentored junior design staff, ensuring UI/UX alignment with product goals.',
        'Maintained backend systems, SQL databases, and IT infrastructure with 99%+ uptime and strict data integrity standards.',

      ],
      features: [
        'Developed and shipped new features across frontend and backend for a live travel/stay booking platform.',
        'Automated manual booking and approval processes, reducing turnaround time for corporate clients.',
        'Administered ServiceNow modules — Incident, Problem, Change, IT Asset Management, and Request Fulfillment.',
        'Maintained SQL databases and backend systems with 99%+ uptime and strict data integrity standards.',
        'Oversaw frontend UI/UX work (HTML, CSS, JavaScript) and mentored junior design staff on the design team.',
      ],
    },
    lms: {
      tag: 'Full-Stack / Greenfield',
      title: 'Vidan',
      contributions: [
        'Feature-rich Learning Management System designed for schools, institutes, and organizations to create, manage, and deliver online learning content across web and mobile platforms.',
        'Developed frontend UI modules including course management, student dashboards, and reporting screens.',
        "Built responsive, mobile-friendly layouts ensuring seamless cross-device experience.",
        "Participated in continuous product enhancement cycles — adding new features, fixing bugs, and improving UX based on client feedback",
        "Built and integrated backend APIs using Node.js and Express.js to support core application functionality."
      ],
      features: [
        'Frontend UI modules for course management, student dashboards, and reporting screens.',
        'Responsive, mobile-friendly layouts for a seamless cross-device experience.',
        'Backend APIs built with Node.js and Express.js powering core application functionality.',
        'Continuous enhancement cycles — new features, bug fixes, and UX improvements based on client feedback.',
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

  constructor(private host: ElementRef<HTMLElement>) { }

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
  downloadResume(): void {
    const link = document.createElement('a');
    link.href = 'assets/RishiKumar_Resume.pdf';
    link.download = 'RishiKumar_Resume.pdf';
    link.click();
  }
}