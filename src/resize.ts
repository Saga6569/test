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

let acc: number;

export const mouseResizeWidth = (event: MouseEvent, state: Istate, el: HTMLElement, main: HTMLElement, render: Function) => {
  // event.stopPropagation()
  if (event.buttons !== 1) {
    return;
  };
  main.style.userSelect = 'none';
  acc = 0;

  if (state.style[el.className].width < el.clientWidth) {
    state.style[el.className].width = el.clientWidth
  }

  const mouseMove = (eMain: MouseEvent) => {
    if (eMain.buttons !== 1) {
      return;
    };
    state.move = true

    acc = eMain.movementX;
    state.style[el.className].width += eMain.movementX
    el.style.width = `${state.style[el.className].width}px`;
  };

  const handleMouseUp = () => {
    main.removeEventListener('mousemove', mouseMove, false);
    main.removeEventListener('mouseup', handleMouseUp, false);
    main.style.userSelect = '';
    state.move = false;
    localStorage.setItem("state", JSON.stringify(state));

    if (acc === 0) {
      return;
    };

    if (state.style[el.className].width < el.clientWidth) {
      state.style[el.className].width = el.clientWidth
    }

    render(state);
  };
  main.addEventListener('mousemove', mouseMove);
  main.addEventListener('mouseup', handleMouseUp);
};


export const mouseResizeHeight = (event: MouseEvent, state: Istate, el: HTMLElement, main: HTMLElement, render: Function) => {
  event.stopPropagation()
  if (event.buttons !== 1) {
    return;
  };
  el.removeAttribute('draggable')
  main.style.userSelect = 'none';
  acc = 0

  if (state.style[el.className].height < el.clientHeight) {
    state.style[el.className].height = el.clientHeight
  }

  const mouseMove = (eMain: MouseEvent) => {
    state.move = true
    if (eMain.buttons !== 1) {
      return;
    };
    state.style[el.className].height += eMain.movementY;
    acc = state.style[el.className].height;
    el.style.height = `${state.style[el.className].height}px`;
  };

  const handleMouseUp = () => {
    main.removeEventListener('mousemove', mouseMove, false);
    main.removeEventListener('mouseup', handleMouseUp, false);
    main.style.userSelect = '';
    el.setAttribute('draggable', 'true');
    state.move = false
    localStorage.setItem("state", JSON.stringify(state));
    if (acc === 0) {
      return;
    }
    if (state.style[el.className].height < el.clientHeight) {
      state.style[el.className].height = el.clientHeight
    }
    render(state);
  };

  main.addEventListener('mousemove', mouseMove);
  main.addEventListener('mouseup', handleMouseUp);
};