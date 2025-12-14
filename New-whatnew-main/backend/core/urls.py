from django.urls import path
from . import share_views

urlpatterns = [
    # Share handler
    path('share/', share_views.share_handler, name='share-handler'),
    
    # Well-known files for app association
    path('.well-known/assetlinks.json', share_views.well_known_assetlinks, name='assetlinks'),
    path('.well-known/apple-app-site-association', share_views.well_known_apple_app_site_association, name='apple-app-site-association'),
    
    # Legacy share redirects
    path('share-page/', share_views.legacy_share_redirect, name='legacy-share-page'),
    path('share-redirect/', share_views.legacy_share_redirect, name='legacy-share-redirect'),
]
