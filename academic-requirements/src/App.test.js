import { fireEvent, render, screen } from "@testing-library/react";
import { hasUncaughtExceptionCaptureCallback } from "node:process";
import React from 'react';
import App from "./App";
import InputPage from "./components/InputPage.tsx";

describe('Test for App',()=>{
  test('Test Rendering',()=>{
    const {getByTestId}=render(<App/>)
    expect(getByTestId('content')).toBeInTheDocument()
    expect(screen.getAllByRole("combobox",{label:"Major"}).selected).toBe(true)
    const button = getByTestId('GenerateSchedule')
    expect(button.textContent).toBe("Generate My Schedule")
    fireEvent.click(button)
    expect(getByTestId('popup')).toBeInTheDocument()
  })
})

