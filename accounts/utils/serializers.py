from django.forms.models import model_to_dict

def serialize_instance(instance, exclude_fields=None):
    """
    Convert model instance to dict JSON-serializable (handle File/ImageField).
    """
    exclude_fields = exclude_fields or []
    data = model_to_dict(
        instance, 
        fields=[f.name for f in instance._meta.fields if f.name not in exclude_fields]
    )

    # Handle URL FileField / ImageField
    for field in instance._meta.fields:
        if field.name in exclude_fields:
            continue
        value = getattr(instance, field.name)
        if hasattr(value, "url"):      # File/Image have url
            data[field.name] = value.url
        elif hasattr(value, "name"):   # File nhưng has no url
            data[field.name] = value.name

    return data