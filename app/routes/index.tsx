import React from 'react';

import { redirect } from '@remix-run/node'

export const loader = () => redirect('/todos')

export default function Index() {
  return null;
}