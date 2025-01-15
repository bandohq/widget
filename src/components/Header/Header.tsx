import type { FC, PropsWithChildren } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDefaultElementId } from "../../hooks/useDefaultElementId";
import { useSetHeaderHeight } from "../../stores/header/useHeaderStore";
import { ElementId, createElementId } from "../../utils/elements";
import { stickyHeaderRoutes } from "../../utils/navigationRoutes";
import { Container } from "./Header.style";
import { NavigationHeader } from "./NavigationHeader";
import { WalletHeader } from "./WalletHeader";
import { Alert } from "../Alert/Alert";
import { useNotificationContext } from "../../providers/AlertProvider/AlertProvider";

export const HeaderContainer: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const elementId = useDefaultElementId();
  const headerRef = useRef<HTMLDivElement>(null);
  const { setHeaderHeight } = useSetHeaderHeight();
  const { showNotification } = useNotificationContext();

  useLayoutEffect(() => {
    const handleHeaderResize = () => {
      const height = headerRef.current?.getBoundingClientRect().height;

      if (height) {
        setHeaderHeight(height);
      }
    };

    let resizeObserver: ResizeObserver;

    if (headerRef.current) {
      resizeObserver = new ResizeObserver(handleHeaderResize);
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [setHeaderHeight]);

  useEffect(() => {
    setTimeout(() => {
      showNotification("success", "Success message");
    }, 2000);
  }, [showNotification]);

  return (
    <Container
      id={createElementId(ElementId.Header, elementId)}
      sticky={stickyHeaderRoutes.some((route) => pathname.includes(route))}
      ref={headerRef}
    >
      {children}
    </Container>
  );
};

export const Header: FC = () => {
  return (
    <HeaderContainer>
      <WalletHeader />
      <Alert />
      <NavigationHeader />
    </HeaderContainer>
  );
};
