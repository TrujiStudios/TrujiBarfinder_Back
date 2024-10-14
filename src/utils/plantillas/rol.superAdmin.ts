interface Access {
    c: boolean;
    r: boolean;
    u: boolean;
    d: boolean;
}

interface AccessModule {
    showModule: boolean;
}

interface Authorizations {
    moduleApp: {
        accessModule: AccessModule;
    };
    users: {
        accessModule: AccessModule;
        access: Access;
        personalInformation: {
            access: Access;
        };
    };
    roles: {
        accessModule: AccessModule;
        access: Access;
    };
    table: {
        accessModule: AccessModule;
        access: Access;
    };
}

interface PlantillaRolSuperUser {
    name: string;
    type: string;
    defaulUser: boolean;
    defalultAdmin: boolean;
    authorizations: Authorizations;
    accessTo: any[];
}



const plantillaRolSuperUser: PlantillaRolSuperUser = {
    name: "plantilla administrador",
    type: "SuperAdmin",
    defaulUser: false,
    defalultAdmin: true,
    authorizations: {
        moduleApp: {
            accessModule: {
                showModule: true
            }
        },
        users: {
            accessModule: {
                showModule: true
            },
            access: {
                c: true,
                r: true,
                u: true,
                d: true
            },
            personalInformation: {
                access: {
                    c: true,
                    r: true,
                    u: true,
                    d: true
                }
            }
        },
        roles: {
            accessModule: {
                showModule: true
            },
            access: {
                c: true,
                r: true,
                u: true,
                d: true
            }
        },
        table: {
            accessModule: {
                showModule: true
            },
            access: {
                c: true,
                r: true,
                u: true,
                d: true
            }
        }
    },
    accessTo: []
}

export default plantillaRolSuperUser;