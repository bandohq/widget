import { PageContainer } from "../../components/PageContainer";
import { PoweredBy } from "../../components/PoweredBy/PoweredBy";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { ErrorView } from "./ErrorView";
import { PendingView } from "./PendingView";
import { StatusPageContainer } from "./StatusPage.style";

export const StatusPage = () => {
  const { hiddenUI } = useWidgetConfig();
  const status = "failed";

  const renderStatusView = () => {
    switch (status) {
      case "pending":
        return <PendingView />;
      case "failed":
        return <ErrorView />;
      case "success":
        return null;
      default:
        return null;
    }
  };

  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);

  return (
    <PageContainer>
      <StatusPageContainer>{renderStatusView()}</StatusPageContainer>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  );
};
