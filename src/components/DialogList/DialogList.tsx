import { IconButton, List, Typography } from "@mui/material";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import CloseIcon from "@mui/icons-material/Close";
import { ImageAvatar } from "../Avatar/Avatar";
import { splitCamelCase } from "../../utils/truncateText";

interface DialogListProps {
  type: string;
  title: string;
  image: string;
  items: Array<any>;
  onClose: () => void;
  renderItem: (item: any, index: number) => React.ReactNode;
}

export const DialogList: React.FC<DialogListProps> = ({
  onClose,
  type,
  title,
  image,
  items,
  renderItem,
}) => {
  const scrollElementRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    overscan: 5,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 70,
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 12px 0 12px",
          position: "relative",
        }}
      >
        <div style={{ flex: 1 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          {splitCamelCase(title)}
        </Typography>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <ImageAvatar
          hideName
          name={title}
          src={image}
          sx={{
            maxWidth: "80px",
            width: "100%",
            minHeight: "80px",
            borderRadius: "12px",
          }}
        />
      </div>
      <div
        ref={scrollElementRef}
        style={{
          overflowY: "auto",
        }}
      >
        <List
          style={{
            height: virtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(items[virtualItem.index], virtualItem.index)}
            </div>
          ))}
        </List>
      </div>
    </>
  );
};
