import React from 'react';
import {createRoot} from 'react-dom/client';
import {AccessGate} from './AccessGate.tsx';
const root=document.getElementById('root');
if(root)createRoot(root).render(<AccessGate/>);
