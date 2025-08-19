import { Component } from '@angular/core';


@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  team = [
    {
      name: 'Sarah Johnson',
      role: 'Creative Director',
      image: 'images/testimonial-01.png',
      desc: 'Leading design innovation with 10+ years in fashion tech.'
    },
    {
      name: 'Michael Lee',
      role: 'Tech Architect',
      image: 'images/testimonial-02.png',
      desc: 'Building high-performance e-commerce platforms.'
    },
    {
      name: 'Emma Davis',
      role: 'Marketing Lead',
      image: 'images/testimonial-03.png',
      desc: 'Connecting global fashion with cutting-edge digital strategy.'
    }
  ];

  features = [
    { icon: '💡', title: 'Innovative Designs', desc: 'Cutting-edge fashion with technology-driven inspirations.' },
    { icon: '⚡', title: 'Fast & Reliable', desc: 'Seamless shopping experience with instant updates.' },
    { icon: '🌍', title: 'Eco-Friendly', desc: 'Committed to sustainability with every product we create.' },
    { icon: '🔒', title: 'Secure Shopping', desc: 'Your data is protected with enterprise-level security.' }
  ];

}
