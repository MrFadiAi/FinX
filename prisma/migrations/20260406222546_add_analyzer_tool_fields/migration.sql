-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "competitorAnalysis" JSONB DEFAULT '{}',
ADD COLUMN     "complianceAudit" JSONB DEFAULT '{}',
ADD COLUMN     "contentAudit" JSONB DEFAULT '{}',
ADD COLUMN     "crawlData" JSONB DEFAULT '{}',
ADD COLUMN     "formData" JSONB DEFAULT '{}',
ADD COLUMN     "imageAudit" JSONB DEFAULT '{}',
ADD COLUMN     "integrationData" JSONB DEFAULT '{}',
ADD COLUMN     "securityAudit" JSONB DEFAULT '{}',
ADD COLUMN     "seoAudit" JSONB DEFAULT '{}',
ADD COLUMN     "structuredData" JSONB DEFAULT '{}';
