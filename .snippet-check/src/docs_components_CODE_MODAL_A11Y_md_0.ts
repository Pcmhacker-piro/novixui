type CodeModalItem = {
  id: string;           // stable id; feeds `aria-labelledby` (§1)
  name: string;         // visible dialog title + download filename slug
  code?: string;        // React/TSX source shown in the code panel
  render: () => ReactNode; // live preview node
};

interface CodeModalProps {
  item: CodeModalItem;
  onClose: () => void;
  shareCategory?: string;
  hostAttr?: string;
  preview?: ReactNode;
}
