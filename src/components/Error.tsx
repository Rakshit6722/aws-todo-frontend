import { ErrorProps } from "../types";
import React from 'react';

export default function Error({ message, status }: ErrorProps) {

  return (
    <div className="Error">
      <h1>Oops, something went bad!</h1>
      <h3>{message}</h3>
      <h5>Status Code: {status}</h5>   
    </div>
  );
}
