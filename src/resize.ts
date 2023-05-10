interface Identifier {
  [key: string]: string;
};
interface Istate {
  requestStatus: 'progress' | 'successfully' | 'ERROR' | '';
  arrData: Identifier[];
  arrDataKeys: string[]
  drag: any;
  move: boolean;
  style: any;
};

export const onmousedown = (event: MouseEvent, state: Istate, el: HTMLElement, main: HTMLElement, render: Function) => {

  event.stopPropagation()
  if (event.buttons !== 1) {
    return;
  };
  main.style.userSelect = 'none';
  const mouseMove = (eMain: MouseEvent) => {
    if (eMain.buttons !== 1) {
      return;
    };
    state.move = true
    state.style[el.className].width += eMain.movementX;
    const newWidth = state.style[el.className].width;
    el.style.width = `${newWidth}px`;
  }
  const handleMouseUp = () => {
    main.removeEventListener('mousemove', mouseMove, false);
    main.removeEventListener('mouseup', handleMouseUp, false);
    main.style.userSelect = '';
    state.move = false
    localStorage.setItem("state", JSON.stringify(state));
    render(state);
  };
  main.addEventListener('mousemove', mouseMove);
  main.addEventListener('mouseup', handleMouseUp);
};

export const onmousedown2 = (event: MouseEvent, state: Istate, el: HTMLElement, main: HTMLElement, render: Function) => {
  event.stopPropagation()
  if (event.buttons !== 1) {
    return;
  };

  el.removeAttribute('draggable')
  main.style.userSelect = 'none';
  const mouseMove = (eMain: MouseEvent) => {
    state.move = true
    if (eMain.buttons !== 1) {
      return;
    };
    state.style[el.className].height += eMain.movementY;
    const newHeight = state.style[el.className].height;
    el.style.height = `${newHeight}px`;
  };
  const handleMouseUp = () => {
    main.removeEventListener('mousemove', mouseMove, false);
    main.removeEventListener('mouseup', handleMouseUp, false);
    main.style.userSelect = '';
    el.setAttribute('draggable', 'true');
    state.move = false
    localStorage.setItem("state", JSON.stringify(state));
    render(state);
  };
  main.addEventListener('mousemove', mouseMove);
  main.addEventListener('mouseup', handleMouseUp);
};