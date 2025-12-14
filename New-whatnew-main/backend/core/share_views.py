from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os


@require_http_methods(["GET"])
def share_handler(request):
    """
    Main share handler for deep links.
    Handles referral codes, product shares, and livestream shares.
    """
    # Get parameters
    ref_code = request.GET.get('ref')
    product_id = request.GET.get('product')
    livestream_id = request.GET.get('livestream')
    
    # Determine share type and content
    share_type = 'referral'
    share_content = {
        'title': 'WhatNew - Live Shopping Experience',
        'description': 'Join WhatNew for the ultimate live shopping experience.',
        'image': 'https://app.whatnew.in/assets/og-image.jpg'
    }
    
    if ref_code:
        share_type = 'referral'
        share_content.update({
            'title': 'Join WhatNew with my invite!',
            'description': f'Use referral code {ref_code} to get welcome rewards on WhatNew',
            'image': 'https://app.whatnew.in/assets/referral-og.jpg',
            'ref_code': ref_code
        })
    elif product_id:
        share_type = 'product'
        share_content.update({
            'title': 'Check out this product on WhatNew!',
            'description': 'Amazing deals and live shopping experience',
            'image': 'https://app.whatnew.in/assets/product-og.jpg',
            'product_id': product_id
        })
    elif livestream_id:
        share_type = 'livestream'
        share_content.update({
            'title': 'Join this live stream on WhatNew!',
            'description': 'Live shopping experience with real-time deals',
            'image': 'https://app.whatnew.in/assets/livestream-og.jpg',
            'livestream_id': livestream_id
        })
    
    # Check user agent to determine if mobile
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
    is_mobile = any(device in user_agent for device in ['mobile', 'android', 'iphone', 'ipad'])
    
    context = {
        'share_type': share_type,
        'share_content': share_content,
        'is_mobile': is_mobile,
        'current_url': request.build_absolute_uri(),
        'ref_code': ref_code,
        'product_id': product_id,
        'livestream_id': livestream_id,
    }
    
    return render(request, 'share/index.html', context)


@require_http_methods(["GET"])
def well_known_assetlinks(request):
    """Serve Android app links verification file"""
    assetlinks_content = """[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.shop.whatnew",
    "sha256_cert_fingerprints": [
      "AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB"
    ]
  }
}]"""
    return HttpResponse(assetlinks_content, content_type='application/json')


@require_http_methods(["GET"])
def well_known_apple_app_site_association(request):
    """Serve iOS app site association file"""
    apple_content = """{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.shop.whatnew",
        "paths": [
          "/share/*",
          "/product/*",
          "/livestream/*"
        ]
      }
    ]
  }
}"""
    return HttpResponse(apple_content, content_type='application/json')


@require_http_methods(["GET"])
def legacy_share_redirect(request):
    """
    Handle legacy share URLs and redirect to new unified format
    """
    # Extract any existing parameters
    ref_code = request.GET.get('ref')
    product_id = request.GET.get('product')
    livestream_id = request.GET.get('livestream')
    
    # Build new share URL
    new_params = []
    if ref_code:
        new_params.append(f'ref={ref_code}')
    if product_id:
        new_params.append(f'product={product_id}')
    if livestream_id:
        new_params.append(f'livestream={livestream_id}')
    
    new_url = '/share'
    if new_params:
        new_url += '?' + '&'.join(new_params)
    
    return redirect(new_url, permanent=True)
