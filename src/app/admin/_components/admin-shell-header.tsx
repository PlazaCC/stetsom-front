"use client";

import { AdminTabs } from "@/app/admin/_components/crud/admin-tabs";
import { AdminWizardTabs } from "@/app/admin/_components/crud/admin-wizard-tabs";
import {
  useHeaderStepTabs,
  useRouteLabels,
} from "@/app/admin/_components/admin-route-meta";
import {
  buildBreadcrumb,
  resolveRoute,
  resolveTabs,
} from "@/lib/cms/resolve-route";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface AdminShellHeaderProps {
  className?: string;
}

/**
 * Single, config-driven header for the admin shell. Reads the current pathname,
 * resolves its static data from `@/lib/cms/config` and renders the breadcrumb,
 * page title and (inherited) tab bar. Pages no longer render their own title.
 */
export function AdminShellHeader({ className }: AdminShellHeaderProps) {
  const pathname = usePathname();
  const labels = useRouteLabels();
  const stepTabs = useHeaderStepTabs();
  const route = resolveRoute(pathname);

  // Unmapped route — render nothing rather than a wrong/empty title.
  if (!route) return null;

  const crumbs = buildBreadcrumb(pathname, labels);
  // A page can contribute stateful step tabs; they take precedence over the
  // route-based navigation tabs from config.
  const tabs = stepTabs ? undefined : resolveTabs(pathname);
  const Icon = route.icon;
  // A runtime override (e.g. product name) wins over the static label.
  const title = labels[pathname] ?? route.label;

  return (
    <div
      className={cn(
        "relative z-10 flex flex-col gap-0.5 border-b bg-card",
        className,
      )}
    >
      <div className="flex flex-col gap-2 border-b px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-6" />}
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>

        {crumbs.length > 1 && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            {crumbs.map((crumb, i) => (
              <Fragment key={crumb.href}>
                {i > 0 && <ChevronRight className="size-3 shrink-0" />}
                {crumb.isCurrent ? (
                  <span className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                )}
              </Fragment>
            ))}
          </nav>
        )}
      </div>

      {stepTabs ? (
        <AdminWizardTabs
          tabs={stepTabs.steps.map((label) => ({ label }))}
          activeIndex={stepTabs.activeIndex}
          onSelect={stepTabs.onSelect}
          className="px-5 lg:px-5"
        />
      ) : tabs && tabs.length > 0 ? (
        <AdminTabs items={tabs} className="border-b-0 px-5" />
      ) : null}
    </div>
  );
}
