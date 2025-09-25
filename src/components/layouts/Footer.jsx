import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full mt-16 py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-4">
      <div className="flex justify-center items-center gap-2 md:gap-4 flex-col md:flex-row">
        <p>
          Este produto usa a API do TMDb mas não é endossado ou certificado pelo{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline text-slate-400 hover:text-cyan-400 transition-colors"
          >
            TMDb
          </a>
          .
        </p>
      </div>
      <p>
        Criado por{' '}
        <a
          href="https://brianlucca.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          Brian Lucca
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;