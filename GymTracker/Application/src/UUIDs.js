// Define an object named ForcePlateUUIDS
export const ForcePlateUUIDS = {
    // Define properties with specific values

    // This property represents a primary service UUID
    PRIMARY_SERVICE: '713d0000-503e-4c75-ba94-3148f18d941e',

    // This property represents a notify characteristic UUID
    NOTIFY: '713d0002-503e-4c75-ba94-3148f18d941e',

    // This property represents a write characteristic UUID
    WRITE: '713d0003-503e-4c75-ba94-3148f18d941e',

    // These properties represent specific commands as Uint8Array objects

    // START command as a Uint8Array
    START: new Uint8Array([241, 2]),

    // STOP command as a Uint8Array
    STOP: new Uint8Array([241, 0]),

    // TARE command as a Uint8Array
    TARE: new Uint8Array([253, 48]),

    // GAIN1 command as a Uint8Array
    GAIN1: new Uint8Array([253, 65, 5, 140]),

    // GAIN2 command as a Uint8Array
    GAIN2: new Uint8Array([253, 66, 5, 200]),

    // FLASH command as a Uint8Array
    FLASH: new Uint8Array([253, 85]),
};

