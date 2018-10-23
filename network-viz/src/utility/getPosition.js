export function getPositionX(outerR, percentR, angle) {
    return outerR*percentR * Math.cos(angle) + outerR
}

export function getPositionY(outerR, percentR, angle) {
    return outerR*percentR * Math.sin(angle) + outerR
}

export default {getPositionX};
