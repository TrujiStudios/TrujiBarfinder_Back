interface Access {
    c: boolean;
    r: boolean;
    u: boolean;
    d: boolean;
}

interface AccessModule {
    showModule: boolean;
}

interface Authorization {
    moduleApp: {
        accessModule: AccessModule;
    };
    personalInformation: {
        accessModule: AccessModule;
        access: Access;
    };
}

interface PlantillaRolUser {
    name: string;
    type: string;
    defauldUser: boolean;
    defauldAdmin: boolean;
    authorization: Authorization;
    accessTo: any[];
}


const plantillaRolUser: PlantillaRolUser = {
    name: "planilla User",
    type: "User",
    defauldUser: true,
    defauldAdmin: false,
    authorization: {
        moduleApp: {
            accessModule: {
                showModule: true
            }
        },
        personalInformation: {
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
    accessTo: [
        {
            "path": "/configurations",
            "title": "configuracion",
            "icon": "calendar_today",
            "class": ""
        },
        {
            "path": "/users",
            "title": "usuarios",
            "icon": "people",
            "class": ""
        },
        {
            "path": "/roles",
            "title": "roles",
            "icon": "people",
            "class": ""
        },
        {
            "path": "/tables",
            "title": "tablas",
            "icon": "people",
            "class": ""
        }

    ]
}

export default plantillaRolUser;