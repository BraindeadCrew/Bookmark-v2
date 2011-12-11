def process_tag_count(tags, max_percent=125, min_percent=75):
    count_array = []
    for tag in tags:
        count_array.append(tag['count'])

    max_count = 0
    min_count = 0
    if len(count_array) > 0:
        max_count = max(count_array)
        min_count = min(count_array)


    for tag in tags:
        tag['size'] = _get_size(max_percent, min_percent, max_count,
            min_count, tag['count'])

    return tags


def _get_size(max_percent, min_percent, max_count, min_count, count):
    if max_count == min_count:
        max_count += 1
    multiplier = (max_percent - min_percent) / (max_count - min_count)
    return min_percent + ((max_count - (max_count - (count - min_count)))
        * multiplier)


if __name__ == "__main__":
    tags_array = [
        {"count": 1, "name": "tag1", },
        {"count": 2, "name": "tag2", },
        {"count": 1, "name": "tag2", },
    ]

    print process_tag_count(tags_array)
