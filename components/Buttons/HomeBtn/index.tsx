// This component contains the search button, which when pressed diplsays the search panel (@/components/SearchPanel/index.tsx).
'use client';
import Link from 'next/link';
import React from 'react';

const HomeBtn = ({ styles }: { styles: string }) => {
  return (
    <>
      <Link href={'./'}>
        <button className={styles} id="homeBtn" aria-label="home">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
      </Link>
    </>
  );
};

export default HomeBtn;
