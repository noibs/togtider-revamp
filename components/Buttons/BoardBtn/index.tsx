'use client';
import React from 'react';
import Link from 'next/link';

const BoardBtn = ({ styles }: { styles: string }) => {
  return (
    <Link href={'./board'}>
      <button className={styles} aria-label="Open departureboard page">
        <i className="fa-kit fa-solid-table-clock"></i>
      </button>
    </Link>
  );
};

export default BoardBtn;
