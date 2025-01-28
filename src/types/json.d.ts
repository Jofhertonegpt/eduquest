declare module "*.json" {
    const value: {
        name?: string;
        description?: string;
        programOutcomes?: string[];
        institution?: string;
        complianceStandards?: string[];
        degrees?: Array<{
            id: string;
            title: string;
            type: string;
            description: string;
            requiredCredits: number;
            metadata: {
                academicYear: string;
                deliveryFormat: string;
                department: string;
            };
            courses: string[];
        }>;
    };
    export default value;
}