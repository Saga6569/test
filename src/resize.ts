export const mouseDown = (e: any, state: any) => {
  console.log('1')
  if (e.buttons !== 1) {
    return
  }
  state.move = true;
  const lineEl = e.target.parentElement.parentElement.parentElement
  lineEl.removeAttribute('draggable')
  document.body.style.userSelect = 'none'
}

let value: number
let key: number

export const mouseMove = (e: any, state: any) => {
  if (e.buttons !== 1) {
    return
  }
  if (!state.move) {
    return
  }

  const cell = e.target.parentElement.parentElement
  const lineEl = e.target.parentElement.parentElement.parentElement

  if (lineEl.className.startsWith('line')) {
    const newHeight = state.style[lineEl.className].height + e.movementY;
    lineEl.style.height = `${newHeight}px`;
    state.style[lineEl.className].height = newHeight;
  } else {
    document.querySelectorAll(`.${cell.className}`).forEach((el: any) => {
      const newWidth = state.style[cell.className].width + e.movementX;
      state.style[cell.className].width = newWidth;
      el.style.width = `${newWidth}px`;

    })
    value = state.style[cell.className].width;
    key = cell.className;
  }
}

export const mouseUp = (e: any, state: any, render: Function) => {
  state.move = false;
  const lineEl = e.target.parentElement.parentElement.parentElement
  lineEl.setAttribute('draggable', 'true')
  localStorage.setItem("state", JSON.stringify(state));
  document.body.style.userSelect = ''
  render(state);
}
