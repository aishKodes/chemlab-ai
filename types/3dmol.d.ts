declare module "3dmol" {
  type ThreeDmolViewer = {
    clear: () => void;
    addModel: (data: string, format: string) => unknown;
    setStyle: (selection: Record<string, unknown>, style: Record<string, unknown>) => void;
    zoomTo: () => void;
    render: () => void;
    spin: (axis: string | false, speed?: number) => void;
  };

  const value: {
    createViewer: (element: HTMLElement, options?: Record<string, unknown>) => ThreeDmolViewer;
  };
  export = value;
}
