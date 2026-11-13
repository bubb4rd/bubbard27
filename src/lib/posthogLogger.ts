import posthog from "posthog-js";

export function logPortfolioInteraction(message: string, attributes: Record<string, string>) {
  posthog.logger.info(message, { log_source: "portfolio_interactions", ...attributes });
}
