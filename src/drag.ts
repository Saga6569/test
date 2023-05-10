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

let acc: number = 0;

export const onmousedown3 = (event: any, state: Istate, line: HTMLElement, main: HTMLElement, render: Function, reorder: Function) => {
  if (event.buttons !== 1) {
    return;
  };
  if (event.target.className === 'buttonClose') {
    return;
  };
  if (state.move){
    return
  }

  console.log('121')

  const dragOld = state.drag
  event.stopPropagation()


  line.style.position = 'relative';
  line.style.pointerEvents = 'none';
  line.style.opacity = '0.2'
  line.childNodes.forEach((el: HTMLElement) => el.style.pointerEvents = 'none')
  main.style.userSelect = 'none';

  acc = 0;
  line.style.top = `${acc}px`;
  const mouseMove = (eMain: MouseEvent) => {
    if (eMain.buttons !== 1) {
      return;
    };
    acc += eMain.movementY;
    line.style.top = `${acc}px`;
  }

  const handleMouseUp = (e: any) => {

    main.removeEventListener('mousemove', mouseMove, false);
    main.removeEventListener('mouseup', handleMouseUp, false);
    main.style.userSelect = '';


    if (state.drag !== dragOld || state.drag !== '') {
      state.arrData = reorder(state.drag, state, line.id);
      localStorage.setItem("state", JSON.stringify(state));
      render(state);
    };

    line.style.position = '';
    line.style.pointerEvents = '';
    main.style.userSelect = '';
    line.style.opacity = '1'
    line.childNodes.forEach((el: HTMLElement) => el.style.pointerEvents = '')
    state.drag = ''
  };

  main.addEventListener('mousemove', mouseMove);
  main.addEventListener('mouseup', handleMouseUp);
};