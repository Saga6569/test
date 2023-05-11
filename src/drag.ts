interface IarrData {
  [key: string]: string;
};

interface Istate {
  requestStatus: 'progress' | 'successfully' | 'ERROR' | '';
  arrData: IarrData[];
  arrDataKeys: string[]
  drag: any;
  move: boolean;
  style: any;
};

const onMouseDragAndDrop = (event: any, state: Istate, line: HTMLElement, main: HTMLElement, render: Function, reorder: Function) => {
  if (event.buttons !== 1) {
    return;
  };
  if (event.target.className === 'buttonClose') {
    return;
  };
  if (state.move) {
    return;
  };

  console.log(line)

  const dragOld = state.drag;
  event.stopPropagation();

  line.style.position = 'relative';
  line.style.pointerEvents = 'none';
  line.style.opacity = '0.2'
  main.style.userSelect = 'none';

  let acc: number = 0;
  line.style.top = `${acc}px`;
  const mouseMove = (eMain: MouseEvent) => {
    if (eMain.buttons !== 1) {
      return;
    };
    acc += eMain.movementY;
    line.style.top = `${acc}px`;
  };

  const handleMouseUp = (e: any) => {
    console.log(e.target)
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
    line.style.opacity = '1';
    line.childNodes.forEach((el: HTMLElement) => el.style.pointerEvents = '');
    state.drag = '';
  };

  main.addEventListener('mousemove', mouseMove);
  main.addEventListener('mouseup', handleMouseUp);
};

export default onMouseDragAndDrop;