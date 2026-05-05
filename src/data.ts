import { Project } from './types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Nebula Engine',
    description: 'A high-performance recursive 3D rendering engine built with WebGPU and custom shaders.',
    category: 'Lab & Experiments',
    techStack: ['TypeScript', 'WebGPU', 'GLSL'],
    link: '#',
    isFeatured: true,
    size: 'large'
  },
  {
    id: '2',
    title: 'Cyber Racer 2099',
    description: 'High-octane synthwave racing game with procedurally generated tracks.',
    category: 'Entertainment & Games',
    techStack: ['React', 'Three.js', 'CANNON.js'],
    link: '#',
    size: 'medium'
  },
  {
    id: '3',
    title: 'Focus Flow',
    description: 'Minimalist habit tracker with biofeedback-driven task prioritization.',
    category: 'Utility & Web Tools',
    techStack: ['Node.js', 'PostgreSQL', 'Tailwind'],
    link: '#',
    size: 'small'
  },
  {
    id: '4',
    title: 'Echo Symphony',
    description: 'Collaborative real-time music production environment for browser.',
    category: 'Entertainment & Games',
    techStack: ['Web Audio API', 'Socket.io', 'Vue'],
    link: '#',
    size: 'medium'
  },
  {
    id: '5',
    title: 'Crypto Pulse',
    description: 'Real-time crypto market analysis tool with predictive sentiment tracking.',
    category: 'Utility & Web Tools',
    techStack: ['Python', 'FastAPI', 'React'],
    link: '#',
    size: 'small'
  },
  {
    id: '6',
    title: 'Quantum Chess',
    description: 'Chess variant where pieces exist in superposition until observed.',
    category: 'Entertainment & Games',
    techStack: ['TypeScript', 'React', 'Zustand'],
    link: '#',
    size: 'medium'
  },
  {
    id: '7',
    title: 'Ghost Writer AI',
    description: 'Creative writing assistant that uses deep learning to mimic specific literary styles.',
    category: 'Lab & Experiments',
    techStack: ['PyTorch', 'Next.js', 'OpenAI'],
    link: '#',
    size: 'small'
  }
];
