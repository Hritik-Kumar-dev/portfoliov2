import react from '../assets/tech/react.svg'
import typescript from '../assets/tech/typescript.svg'
import javascript from '../assets/tech/javascript.svg'
import tailwind from '../assets/tech/tailwind.svg'
import nodejs from '../assets/tech/nodejs.svg'
import express from '../assets/tech/express.svg'
import mongodb from '../assets/tech/mongodb.svg'
import postgresql from '../assets/tech/postgresql.svg'
import git from '../assets/tech/git.svg'
import github from '../assets/tech/github.svg'
import vscode from '../assets/tech/vscode.svg'
import nextjs from '../assets/tech/nextjs.svg'
import vercel from '../assets/tech/vercel.svg'
import docker from '../assets/tech/docker.svg'
import vite from '../assets/tech/vite.svg'
import html5 from '../assets/tech/html5.svg'
import css3 from '../assets/tech/css3.svg'
import asterisk from '../assets/tech/asterisk.svg'
import bun from '../assets/tech/bun.svg'
import solana from '../assets/tech/solana.svg'

// w/h = intrinsic size of each exported icon (px).
const t = (label, src, w, h) => ({ label, src, w, h })

// Rows mirror the Figma layout. offset/width position each row's icons,
// mt is the gap above the row.
export const techRows = [
  {
    offset: 5, width: 432, mt: 0,
    items: [
      t('React', react, 57, 51),
      t('TypeScript', typescript, 57, 57),
      t('JavaScript', javascript, 57, 57),
      t('Tailwind CSS', tailwind, 48, 30),
      t('Node.js', nodejs, 48, 31),
      t('Express', express, 57, 57),
    ],
  },
  {
    offset: 8, width: 373, mt: 23,
    items: [
      t('MongoDB', mongodb, 55, 54),
      t('PostgreSQL', postgresql, 53, 53),
      t('Git', git, 57, 57),
      t('GitHub', github, 57, 56),
      t('VS Code', vscode, 48, 48),
    ],
  },
  {
    offset: 19, width: 389, mt: 15,
    items: [
      t('Next.js', nextjs, 48, 48),
      t('Vercel', vercel, 165, 35),
      t('Docker', docker, 50, 36),
      t('Vite', vite, 46, 48),
    ],
  },
  {
    offset: 26, width: 375, mt: 7,
    items: [
      t('HTML5', html5, 44, 57),
      t('CSS3', css3, 44, 57),
      t('Asterisk', asterisk, 50, 50),
      t('Bun', bun, 48, 42),
      t('Solana', solana, 48, 38),
    ],
  },
]
