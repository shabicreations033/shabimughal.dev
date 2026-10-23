// Visuals for each project page, keyed by project slug. Files live in client/public/projects/gallery/.
// layout: 'screens' (wide, 2 columns) or 'phones' (portrait, 4 columns). srcDark is used in dark theme.
const gallery = {
  "ai-smart-warehouse-delivery-management": {
    "layout": "screens",
    "items": [
      {
        "src": "/projects/gallery/ai-smart-warehouse-delivery-management/01-admin-dashboard.webp",
        "w": 696,
        "h": 709,
        "title": "Admin control panel",
        "caption": "Live totals, hourly deliveries and stock distribution."
      },
      {
        "src": "/projects/gallery/ai-smart-warehouse-delivery-management/02-stock-catalogue.webp",
        "w": 1600,
        "h": 583,
        "title": "Stock catalogue",
        "caption": "Every item and its warehouse location at a glance."
      },
      {
        "src": "/projects/gallery/ai-smart-warehouse-delivery-management/03-assign-delivery.webp",
        "w": 1600,
        "h": 745,
        "title": "Assign delivery",
        "caption": "The staff member with the lightest workload is marked Recommended."
      },
      {
        "src": "/projects/gallery/ai-smart-warehouse-delivery-management/04-manager-hub.webp",
        "w": 1600,
        "h": 737,
        "title": "Manager tracking hub",
        "caption": "Deliveries, status and low-stock notifications in one place."
      },
      {
        "src": "/projects/gallery/ai-smart-warehouse-delivery-management/05-optimised-route.webp",
        "w": 1600,
        "h": 741,
        "title": "Optimised route",
        "caption": "AI-ordered delivery stops drawn on a map."
      },
      {
        "src": "/projects/gallery/ai-smart-warehouse-delivery-management/06-staff-deliveries.webp",
        "w": 1600,
        "h": 723,
        "title": "Delivery staff view",
        "caption": "Staff update each delivery from Pending to In Transit to Delivered."
      },
      {
        "src": "/projects/gallery/ai-smart-warehouse-delivery-management/07-invoice.webp",
        "w": 903,
        "h": 874,
        "title": "Invoice",
        "caption": "Generated invoice with line items and totals."
      }
    ]
  },
  "techfix-accounting-system": {
    "layout": "screens",
    "items": [
      {
        "src": "/projects/gallery/techfix-accounting-system/01-record-transaction.webp",
        "w": 1600,
        "h": 735,
        "title": "Record transaction",
        "caption": "Post a journal entry, with an option for adjusting entries."
      },
      {
        "src": "/projects/gallery/techfix-accounting-system/02-general-journal.webp",
        "w": 1600,
        "h": 735,
        "title": "General journal",
        "caption": "Entries in double-entry format with narration."
      },
      {
        "src": "/projects/gallery/techfix-accounting-system/03-ledger.webp",
        "w": 1600,
        "h": 739,
        "title": "Ledger",
        "caption": "Accounts posted automatically from the journal."
      },
      {
        "src": "/projects/gallery/techfix-accounting-system/04-trial-balance.webp",
        "w": 1600,
        "h": 741,
        "title": "Trial balance",
        "caption": "Unadjusted trial balance with matching debit and credit totals."
      },
      {
        "src": "/projects/gallery/techfix-accounting-system/05-income-statement.webp",
        "w": 1600,
        "h": 728,
        "title": "Income statement",
        "caption": "Revenues and expenses producing net income."
      },
      {
        "src": "/projects/gallery/techfix-accounting-system/06-financial-position.webp",
        "w": 1600,
        "h": 739,
        "title": "Statement of financial position",
        "caption": "Assets, liabilities and equity at the reporting date."
      }
    ]
  },
  "fluxlex-lexical-analyzer": {
    "layout": "screens",
    "items": [
      {
        "src": "/projects/gallery/fluxlex-lexical-analyzer/01-input.webp",
        "w": 1600,
        "h": 737,
        "title": "Source input",
        "caption": "Paste code and run the lexical analysis."
      },
      {
        "src": "/projects/gallery/fluxlex-lexical-analyzer/02-symbol-table.webp",
        "w": 1267,
        "h": 874,
        "title": "Symbol table",
        "caption": "Each lexeme with its category, type, description and line."
      },
      {
        "src": "/projects/gallery/fluxlex-lexical-analyzer/03-error-detection.webp",
        "w": 1353,
        "h": 874,
        "title": "Error detection",
        "caption": "Illegal characters and missing terminators flagged by line."
      }
    ]
  },
  "safestate-cryptography-suite": {
    "layout": "screens",
    "items": [
      {
        "src": "/projects/gallery/safestate-cryptography-suite/01-home.webp",
        "w": 1600,
        "h": 722,
        "title": "Cipher lab",
        "caption": "Entry point to the Hill, Vigenère, Rail Fence and Vault tools."
      },
      {
        "src": "/projects/gallery/safestate-cryptography-suite/02-hill-cipher.webp",
        "w": 1600,
        "h": 723,
        "title": "Hill cipher",
        "caption": "Matrix key validated before encrypting or decrypting."
      },
      {
        "src": "/projects/gallery/safestate-cryptography-suite/03-vigenere-cipher.webp",
        "w": 1600,
        "h": 727,
        "title": "Vigenère cipher",
        "caption": "Polyalphabetic encryption and decryption."
      },
      {
        "src": "/projects/gallery/safestate-cryptography-suite/04-rail-fence-cipher.webp",
        "w": 1600,
        "h": 726,
        "title": "Rail Fence cipher",
        "caption": "Zig-zag transposition with a configurable rail count."
      },
      {
        "src": "/projects/gallery/safestate-cryptography-suite/05-secure-vault.webp",
        "w": 1600,
        "h": 732,
        "title": "Secure vault",
        "caption": "AES-256 encrypted storage for sensitive messages."
      }
    ]
  },
  "social-media-analytical-dashboard": {
    "layout": "screens",
    "items": [
      {
        "src": "/projects/gallery/social-media-analytical-dashboard/01-audience.webp",
        "w": 1278,
        "h": 876,
        "title": "Audience insights",
        "caption": "Follower totals, growth and age and gender demographics."
      },
      {
        "src": "/projects/gallery/social-media-analytical-dashboard/02-content-performance.webp",
        "w": 1279,
        "h": 873,
        "title": "Content performance",
        "caption": "Top posts and a content-type breakdown."
      },
      {
        "src": "/projects/gallery/social-media-analytical-dashboard/03-activity.webp",
        "w": 1600,
        "h": 687,
        "title": "Activity",
        "caption": "Recent updates and quick stats across platforms."
      },
      {
        "src": "/projects/gallery/social-media-analytical-dashboard/04-reports.webp",
        "w": 1600,
        "h": 739,
        "title": "Reporting",
        "caption": "Generate summary reports by type and date range."
      },
      {
        "src": "/projects/gallery/social-media-analytical-dashboard/05-er-diagram.webp",
        "w": 1152,
        "h": 1181,
        "title": "ER diagram",
        "caption": "Users, platforms and the social media data that links them."
      }
    ]
  },
  "taskpoint-labour-marketplace": {
    "layout": "phones",
    "items": [
      {
        "src": "/projects/gallery/taskpoint-labour-marketplace/01-home.webp",
        "w": 380,
        "h": 748,
        "title": "Home",
        "caption": "Service categories and nearby workers."
      },
      {
        "src": "/projects/gallery/taskpoint-labour-marketplace/02-ai-assistant.webp",
        "w": 387,
        "h": 755,
        "title": "AI assistant",
        "caption": "Voice or text help in Roman Urdu."
      },
      {
        "src": "/projects/gallery/taskpoint-labour-marketplace/03-job-detail.webp",
        "w": 418,
        "h": 804,
        "title": "Job detail",
        "caption": "Budget, distance and a counter-offer option."
      },
      {
        "src": "/projects/gallery/taskpoint-labour-marketplace/04-make-offer.webp",
        "w": 408,
        "h": 805,
        "title": "Counter-offer",
        "caption": "Choose an amount to bid on a job."
      },
      {
        "src": "/projects/gallery/taskpoint-labour-marketplace/05-track-service.webp",
        "w": 379,
        "h": 752,
        "title": "Track service",
        "caption": "Live map, arrival time and one-tap call."
      },
      {
        "src": "/projects/gallery/taskpoint-labour-marketplace/06-cnic-verification.webp",
        "w": 238,
        "h": 492,
        "title": "CNIC verification",
        "caption": "Identity check by capturing both sides of the CNIC."
      },
      {
        "src": "/projects/gallery/taskpoint-labour-marketplace/07-earnings-wallet.webp",
        "w": 384,
        "h": 737,
        "title": "Earnings and wallet",
        "caption": "Worker balance, limits and recent transactions."
      },
      {
        "src": "/projects/gallery/taskpoint-labour-marketplace/08-emergency-sos.webp",
        "w": 250,
        "h": 501,
        "title": "Emergency SOS",
        "caption": "Countdown before alerting emergency contacts."
      }
    ]
  },
  "netflix-data-analysis": {
    "layout": "screens",
    "ratio": "16 / 9",
    "items": [
      {
        "src": "/projects/gallery/netflix-data-analysis/01-missing-values-light.webp",
        "srcDark": "/projects/gallery/netflix-data-analysis/01-missing-values-dark.webp",
        "w": 1600,
        "h": 900,
        "title": "Missing values",
        "caption": "Director is missing for almost a third of titles."
      },
      {
        "src": "/projects/gallery/netflix-data-analysis/02-releases-by-year-light.webp",
        "srcDark": "/projects/gallery/netflix-data-analysis/02-releases-by-year-dark.webp",
        "w": 1600,
        "h": 900,
        "title": "Titles added by year",
        "caption": "Most titles were added between 2017 and 2020."
      },
      {
        "src": "/projects/gallery/netflix-data-analysis/03-movies-vs-tv-shows-light.webp",
        "srcDark": "/projects/gallery/netflix-data-analysis/03-movies-vs-tv-shows-dark.webp",
        "w": 1600,
        "h": 900,
        "title": "Movies vs TV shows",
        "caption": "Movies make up roughly seven in ten titles."
      },
      {
        "src": "/projects/gallery/netflix-data-analysis/04-content-ratings-light.webp",
        "srcDark": "/projects/gallery/netflix-data-analysis/04-content-ratings-dark.webp",
        "w": 1600,
        "h": 900,
        "title": "Content ratings",
        "caption": "TV-MA and TV-14 account for over half of all titles."
      },
      {
        "src": "/projects/gallery/netflix-data-analysis/05-releases-by-year-and-type-light.webp",
        "srcDark": "/projects/gallery/netflix-data-analysis/05-releases-by-year-and-type-dark.webp",
        "w": 1600,
        "h": 900,
        "title": "Titles by year and type",
        "caption": "Movies and TV shows both peak around 2019 to 2020."
      }
    ]
  },
  "deadlock-detection-rag-wfg": {
    "layout": "screens",
    "ratio": "16 / 9",
    "items": [
      {
        "src": "/projects/gallery/deadlock-detection-rag-wfg/01-rag-detection.webp",
        "w": 1600,
        "h": 900,
        "title": "RAG deadlock detection",
        "caption": "A three-process circular wait found, with the full cycle traced."
      },
      {
        "src": "/projects/gallery/deadlock-detection-rag-wfg/02-resolve-and-prevent.webp",
        "w": 1600,
        "h": 900,
        "title": "Resolution and prevention",
        "caption": "Terminating processes to recover, then resource ordering to prevent it."
      },
      {
        "src": "/projects/gallery/deadlock-detection-rag-wfg/03-wait-for-graph.webp",
        "w": 1600,
        "h": 900,
        "title": "Wait-For Graph detection",
        "caption": "A four-process adjacency matrix and the cycle found in it."
      },
      {
        "src": "/projects/gallery/deadlock-detection-rag-wfg/04-rag-vs-wfg-light.webp",
        "srcDark": "/projects/gallery/deadlock-detection-rag-wfg/04-rag-vs-wfg-dark.webp",
        "w": 1600,
        "h": 900,
        "title": "RAG vs WFG",
        "caption": "The same deadlock as a resource graph and as a wait-for graph."
      }
    ]
  }
};

export function galleryFor(project) {
  return (project && gallery[project.slug]) || null;
}

export default gallery;
