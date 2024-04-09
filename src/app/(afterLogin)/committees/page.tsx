import React from 'react';

type CommitteeListTypeProps = {
  searchParams: {
    category?: string;
    previewId?: string;
    sortDir?: 'asc' | 'desc';
    sku?: string;
    status?: string;
  };
};

// eslint-disable-next-line no-empty-pattern
export default function CommitteeList({}: CommitteeListTypeProps): React.JSX.Element {
  return <article></article>;
}
