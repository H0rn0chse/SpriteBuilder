/**
 * This converter follows xml structure used by Kenney:
 * https://www.kenney.nl/
 *
 * <TextureAtlas imagePath="animals.png">
 *    <SubTexture name="bear" x="184" y="162" width="154" height="132"/>
 *    ...
 * </TextureAtlas>
 */
export function layoutDataToAtlasXml (file) {
    const layoutData = JSON.parse(file.content)
    const filename = "spritesheet.png"

    let atlas = `<TextureAtlas imagePath="${filename}">`

    Object.values(layoutData.sprites).forEach((sprite) => {
        atlas += `\n    <SubTexture name="${sprite.name}" x="${sprite.x}" y="${sprite.y}" width="${sprite.w}" height="${sprite.h}"/>`
    })
    atlas += `\n</TextureAtlas>`

    return {
        name: "atlas.xml",
        content: atlas
    }
}

/**
 * This converter follows the phaser 3 example:
 * https://github.com/photonstorm/phaser3-examples/blob/master/public/assets/loader-tests/texture-packer-multi-atlas.json
 */
export function layoutDataToAtlasJson (file) {
    const layoutData = JSON.parse(file.content)
    const filename = "spritesheet.png"

    const atlas = {
        textures: [{
            image: filename,
            format: "RGBA8888",
            size: {
				w: layoutData.metadata.width,
				h: layoutData.metadata.height
			},
			scale: 1,
			frames: []
        }]
    }
    Object.values(layoutData.sprites).forEach((sprite) => {
        const data = {
            filename: sprite.name,
            frame: {
                x: sprite.x,
                y: sprite.y,
                w: sprite.w,
                h: sprite.h
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: sprite.w,
                h: sprite.h
            },
            sourceSize: {
                w: sprite.w,
                h: sprite.h
            }
        }
        atlas.textures[0].frames.push(data)
    })

    return {
        name: "atlas.json",
        content: JSON.stringify(atlas, null, 2)
    }
}