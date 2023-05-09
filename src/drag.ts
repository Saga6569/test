

let clonEl: HTMLElement;

export const dragStart = (e: any, state: any) => {
  if (state.move) {
    return;
  }
  clonEl = e.target.cloneNode(true) as HTMLElement;
  document.querySelector('.table').append(clonEl);
  state.darag = e.target.id;
  e.dataTransfer.setDragImage(new Image(), 10, 10);
  e.target.style.opacity = '0.1';
};

export const dragMove = (e: any, state: any) => {
  if (state.move) {
    return;
  }
  const el: HTMLElement = e.target;
  clonEl.style.position = 'absolute';
  clonEl.style.pointerEvents = 'none';
  if (e.pageX === 0 && e.pageY === 0) {
    return;
  };
  clonEl.style.top = `${e.pageY - 20}px`;
}

export const dragEnter = (e: any, state: any, reorder: Function) => {
  if (state.move) {
    return;
  }
  const idTarget = e.target.parentElement.id
  if (idTarget === state.darag) {
    return;
  };

  e.target.parentElement.style.backgroundColor = 'gray';
  const res = reorder(idTarget, state);
  state.arrData = res;
};

export const dragLeave = (e: any, state: any) => {
  if (state.move) {
    return;
  }
  e.target.parentElement.style.backgroundColor = '';
};


export const dragEnd = (e: any, state: any, render: Function) => {
  if (state.move) {
    return;
  }
  clonEl.remove();
  e.target.style.opacity = '1';
  document.getElementById(state.darag).style.backgroundColor = '';
  render(state);
}