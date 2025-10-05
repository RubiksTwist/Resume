// Blog data (embedded or fetched)
const blogPosts = [
  { 
    title: "D485 Task 1: Executive Report on Cloud Security Remediation (IAM, Compliance, and Resilience)", 
    content: `### Executive Summary

SWBTL LLC has completed an urgent security remediation project within its new **Microsoft Azure (IaaS) environment**. This action was precipitated by the unexpected and undocumented departure of a key consultant, raising significant concerns about the environment's security posture and compliance alignment. As a business managing sensitive government contracts and daily card transactions, strict adherence to **FISMA** (Federal Information Security Management Act) and **PCI DSS** (Payment Card Industry Data Security Standard) is paramount.

The remediation strategy targeted high-impact risks, primarily **Security Misconfiguration** and **Identity and Access Compromise**. The focus was on fundamentally restructuring **Identity and Access Management (IAM)** and securing critical data assets to establish a compliant, least-privilege cloud baseline.

---

### Strategic IAM Configuration: Enforcing Least Privilege

The primary business requirement for IAM was to enforce the **principle of least privilege** and ensure robust **separation of administrative duties**. This directly addresses the risk of unauthorized access and data viewing observed across departmental resources.

Key actions taken via **Role-Based Access Control (RBAC)**:

1.  **Resource Governance:** All misplaced departmental resources were correctly grouped into their designated **Resource Groups** (e.g., *Accounting-rg*, *Marketing-rg*). This established the foundational scope for all subsequent RBAC assignments.
2.  **Default Reader Access:** General departmental users were assigned the **Reader** role at the Resource Group level. This is the lowest necessary privilege, preventing operational staff from accidentally or maliciously altering underlying infrastructure and securing the environment by default.
3.  **Separation of Duties:** The high-privilege **Owner** role was deliberately fragmented. The IT team responsible for managing VMs and resources was limited to the **Contributor** role, while a separate, dedicated group was assigned the **User Access Administrator** role. This control ensures no single actor can manage both resources and permissions, enforcing critical accountability.

[**Screenshot Placeholder 1: IAM Role Assignments** - *To illustrate the new Reader role assignment and the separation of Contributor/User Access Administrator roles at the Resource Group level.*]

---

### Data Security and Regulatory Compliance

To meet **PCI DSS** requirements for encrypting **data-at-rest** and **data-in-transit**, the Azure Key Vaults—which store cryptographic keys and secrets—were secured with two modern controls:

* **Azure RBAC for Data Plane:** Key Vault access was migrated from legacy Access Policies to the modern **Azure RBAC** model. This provides centralized, auditable, and precise control over which users and applications can access keys, directly supporting compliance standards.
* **Customer-Managed Keys (CMK):** Key Vaults are now configured to manage CMK for **Azure Disk Encryption**, granting SWBTL LLC explicit control over the master keys used to protect data-at-rest. The Key Vaults will also securely manage **TLS/SSL certificates** to ensure secure data-in-transit.

---

### Business Continuity and Resilience

The business requires stringent recovery objectives: a **1-day Recovery Point Objective (RPO)** and a **36-hour Recovery Time Objective (RTO)**. Remediation actions focused on protecting backup data from deletion and ensuring rapid recoverability.

* **Custom Backup Policy:** A new policy was created to enforce daily backups at 7:00 p.m. ET, with a 3-day retention for instant recovery snapshots. This configuration is tuned to meet both the RPO and RTO goals.
* **Immutable Vault:** The **Write-Once-Read-Many (WORM)** feature was enabled on the Recovery Services Vault. This is a critical defense mechanism against **Ransomware and Insider Threats**, ensuring that even a compromised administrator cannot delete or modify recovery points, guaranteeing a clean source for disaster recovery.

[**Screenshot Placeholder 2: Backup Policy and WORM Configuration** - *To illustrate the custom backup policy settings and the Immutable Vault status.*]

---

### Future Governance and Threat Mitigation

Future state planning must focus on continuous compliance and advanced threat mitigation, specifically strengthening the IAM controls for privileged users:

| Threat / Risk | Mitigation Strategy (IAM & Policy Focus) | Business Justification |
| :--- | :--- | :--- |
| **Credential Compromise** (High-Privilege) | Enforce **Privileged Identity Management (PIM)** and **Multi-Factor Authentication (MFA)**. | Implements a **Zero Trust** architecture by requiring Just-in-Time (JIT) access and MFA, drastically reducing the attack surface for administrative accounts. (IAM Focus) |
| **Compliance Drift** / Configuration Error | Deploy and Enforce **Azure Policy** across all Resource Groups. | Establishes a mandatory security baseline (CSPM) and ensures automated, continuous adherence to both FISMA and PCI DSS configuration standards. (Business Focus) |
| **OS & Application Vulnerabilities** | Implement **Azure Update Management** and **Microsoft Defender for Cloud**. | Fulfills the company’s responsibility for OS patching and provides centralized security posture visibility and vulnerability management. |
    `,
    date: "2025-10-05"
  }
];

// Sort blog posts by date (most recent first)
blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Function to display a blog post
function displayBlogPost(date) {
  const post = blogPosts.find(post => post.date === date);
  if (post) {
    document.getElementById("blog-title").innerText = post.title;
    document.getElementById("blog-content").innerHTML = post.content;
  }
}

// Function to generate the blog list
function generateBlogList() {
  const blogLinks = document.getElementById("blog-links");
  blogPosts.forEach(post => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.innerText = post.date;
    link.addEventListener("click", () => displayBlogPost(post.date));
    listItem.appendChild(link);
    blogLinks.appendChild(listItem);
  });
}

// Generate the blog list and display the latest post on page load
generateBlogList();
displayBlogPost(blogPosts[0].date);

// Fetch and display the latest blog post
async function loadLatestBlogPost() {
    const blogTitle = document.getElementById('blog-title');
    const blogMeta = document.getElementById('blog-meta');
    const blogContent = document.getElementById('blog-content');

    try {
        // Fetch the blog data from the JSON file
        const response = await fetch('latest-blog.json');
        const data = await response.json();

        // Use the first blog post in the array
        const latestBlog = data[0];

        // Update the blog section with fetched data
        blogTitle.textContent = latestBlog.title;
        blogMeta.textContent = `By ${latestBlog.author} on ${latestBlog.date}`;
        blogContent.innerHTML = latestBlog.content;
    } catch (error) {
        console.error('Error fetching the latest blog post:', error);
        blogTitle.textContent = 'Error loading blog post';
        blogMeta.textContent = '';
        blogContent.textContent = 'Please try again later.';
    }
}

// Load the latest blog post on page load
document.addEventListener('DOMContentLoaded', loadLatestBlogPost);
