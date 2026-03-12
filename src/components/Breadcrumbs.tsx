'use client'
import Link from "next/link";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <>
      <nav className="breadcrumb">
        <ol className="breadcrumb-list">
          {items.map((item, index) => (
            <li key={index} className="breadcrumb-item">
              {item.href ? (
                <Link href={item.href} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <span className="breadcrumb-separator">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <style jsx>{`
        .breadcrumb {
          margin-bottom: 1rem;
          font-size: 14px;
          color: #6b7280;
          text-align: left;
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: nowrap;
          white-space: nowrap;
          overflow-x: auto;
          gap: 4px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .breadcrumb-link {
          color: #6b7280;
          text-decoration: none;
        }

        .breadcrumb-link:hover {
          color: #2563eb;
        }

        .breadcrumb-current {
          color: #374151;
          font-weight: 500;
        }

        .breadcrumb-separator {
          margin: 0 2px;
        }
      `}</style>
    </>
  );
}
