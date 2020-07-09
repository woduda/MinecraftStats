from mcstats import mcstats

mcstats.registry.append(
    mcstats.MinecraftStat(
        'ride_strider',
        {
            'title': 'The Floor Is Lava',
            'desc': 'Distance ridden on a strider',
            'unit': 'cm',
        },
        mcstats.StatReader(['minecraft:custom','minecraft:strider_one_cm']),
        2534 # added in 20w19a
    ))
