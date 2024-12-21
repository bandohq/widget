import { AppBar, IconButton, List, Toolbar, Typography } from "@mui/material";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import CloseIcon from "@mui/icons-material/Close";
import { ImageAvatar } from "../Avatar/Avatar";

interface DialogListProps {
  onClose: () => void;
  title: string;
  image: string;
  items: Array<any>;
  renderItem: (item: any, index: number) => React.ReactNode;
}

export const DialogList: React.FC<DialogListProps> = ({
  onClose,
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
    estimateSize: () => 60,
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
        <Typography
          variant="h6"
          component="div"
          sx={{
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {title}
        </Typography>
        <ImageAvatar
          name={title}
          src={image}
          sx={{
            maxWidth: "150px",
            width: "100%",
            height: "auto",
            minHeight: "100px",
          }}
        />
      </div>
      <div
        ref={scrollElementRef}
        style={{
          height: "400px",
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
